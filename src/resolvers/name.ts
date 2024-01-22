import { resolver } from "yadmb-types/types/addonTypes"
import reg from "../defaultRegex.js";

export const provider: resolver = {
    name: "spotify",
    async available(url) {
        return reg.test(url);
    },
    priority: 0,
    async resolve(url) {
        return "spotify";
    }
}