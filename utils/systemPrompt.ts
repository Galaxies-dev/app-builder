import fs from 'fs';
import path from 'path';

const promptPath = path.join(process.cwd(), 'resources/systemPrompt.txt');

export function getSystemPrompt() {
  return fs.readFileSync(promptPath, 'utf-8');
}
