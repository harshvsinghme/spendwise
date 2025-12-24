import dayjs from "dayjs";
import dayjsPluginUTC from "dayjs/plugin/utc.js";

// Extend plugins FIRST
dayjs.extend(dayjsPluginUTC);

// Factory functions (best practice)
export const localTime = () => dayjs();
export const utcTime = () => dayjs.utc();
