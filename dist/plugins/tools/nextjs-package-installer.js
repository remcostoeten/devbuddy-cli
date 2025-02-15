import { selectTool, confirmAction } from '../../utils/clack-ui.js';
const nextjsPackages = [
    "@emotion/react",
    "@emotion/styled",
    "@mui/material",
    "@mui/icons-material",
    "tailwindcss",
    "postcss",
    "autoprefixer",
    "sass",
    "styled-components",
    "framer-motion",
];
export const nextjsPackageInstaller = {
    name: "nextjs-package-installer",
    description: "Install common Next.js packages",
    category: "Next.js Tools",
    async action() {
        const choices = nextjsPackages.map(pkg => ({
            value: pkg,
            label: pkg
        }));
        const selectedPackage = await selectTool(choices);
        if (!selectedPackage) {
            console.log("No package selected");
            return;
        }
        const confirmed = await confirmAction(`Install ${selectedPackage}?`);
        if (confirmed) {
            const command = `npm install ${selectedPackage}`;
            console.log(`Running: ${command}`);
            // Execute command here
        }
    }
};
export default nextjsPackageInstaller;
