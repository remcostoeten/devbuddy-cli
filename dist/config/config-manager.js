import Conf from "conf";
const config = new Conf({
    projectName: "devbuddy",
    defaults: {
        theme: "default",
        defaultCategory: "All",
    },
});
export function getConfig(key) {
    return config.get(key);
}
export function setConfig(key, value) {
    config.set(key, value);
}
