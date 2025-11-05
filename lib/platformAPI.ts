import { PlatformApi } from "@instantdb/platform";

const platformAPI = new PlatformApi({
  auth: { token: process.env.INSTANT_PLATFORM_PERSONAL_ACCESS_TOKEN! },
});

export default platformAPI;
