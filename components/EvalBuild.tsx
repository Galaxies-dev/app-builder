"use client";

import { useEffect, useState, use, Suspense } from "react";
import * as Babel from "@babel/standalone";
import React from "react";
import { id as instantId, i, init } from "@instantdb/react";
import clientDB from "@/clientLib/clientDB";
import { Box } from "@/components/ui";
import { resolveBuildIdent } from "@/clientLib/evalHelpers";

export default function EvalBuild({ ident }: { ident: string }) {
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [tailwindLoaded, setTailwindLoaded] = useState(false);

  const whereClause = resolveBuildIdent(ident);

  // Fetch the build by ID
  const { data, isLoading } = clientDB.useQuery({
    builds: {
      $: { where: whereClause },
    },
  });

  const build = data?.builds?.[0];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
    script.onload = () => setTailwindLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!build || !build.code || !tailwindLoaded) return;

    try {
      // Clean the code: find the first import statement and start from there
      let cleanCode = build.code;
      const importIndex = cleanCode.indexOf("import ");
      if (importIndex > 0) {
        cleanCode = cleanCode.substring(importIndex);
      }

      // Trim any text after "export default App;"
      const exportText = "export default App;";
      const exportIndex = cleanCode.indexOf(exportText);
      if (exportIndex > -1) {
        cleanCode = cleanCode.substring(0, exportIndex + exportText.length);
      }

      // Transform the TypeScript code to JavaScript with proper module transformation
      const transformedCode = Babel.transform(cleanCode, {
        presets: ["react", "typescript"],
        plugins: [["transform-modules-commonjs", { strict: false }]],
        filename: "app.tsx",
        sourceType: "module",
      }).code;

      if (!transformedCode) {
        throw new Error("Failed to transform code");
      }

      // Create a function that will evaluate the code with the required context
      const evalCode = `
        (function() {
          const exports = {};
          const module = { exports };
          
          // Create a require function that provides the dependencies
          const require = function(name) {
            const modules = {
              'react': React,
              '@instantdb/react': { id, i, init, InstaQLEntity: {} }
            };
            
            if (modules[name]) {
              return modules[name];
            }
            throw new Error('Module not found: ' + name);
          };
          
          // Provide globals that might be used directly
          const React = arguments[0];
          const instantAppId = arguments[1];
          const id = arguments[2];
          const i = arguments[3];
          const init = arguments[4];
          
          ${transformedCode}
          
          return module.exports.default || module.exports || exports.default || exports.App || App;
        })
      `;

      // Evaluate the code and get the component
      const evalFunc = eval(evalCode);
      const AppComponent = evalFunc(
        React,
        build.instantAppId,
        instantId,
        i,
        init
      );

      if (typeof AppComponent !== "function") {
        throw new Error("Code did not export a valid React component");
      }

      setComponent(() => AppComponent);
      setError(null);
    } catch (err) {
      console.error("Error evaluating code:", err);
      setError(err instanceof Error ? err.message : "Failed to evaluate code");
      setComponent(null);
    }
  }, [build, tailwindLoaded]);

  if (isLoading) {
    return null;
  }

  if (!build) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Box className="border-red-500 p-12">
          <div className="text-red-600">
            Oi! We couldn't find this build. Sorry about that.
          </div>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="border border-red-300 bg-red-50 rounded-lg p-4">
          <div className="text-red-800 font-semibold mb-2">
            Error loading app:
          </div>
          <div className="text-red-700 text-sm font-mono">{error}</div>
        </div>
      </div>
    );
  }

  if (!Component || !tailwindLoaded) {
    return null;
  }

  // Render the component directly without any wrapper
  // This allows it to have full control over the viewport
  return <Component />;
}
