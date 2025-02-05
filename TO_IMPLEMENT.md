## Stuff to implement.

## package.json scripts I use in most projects from the cli
- [ ] Allow running the script from cli
- [ ] Allow adding the script to the package.json of the project we run it in
- [ ] Allow running the script in a specific project

## Running scripts from devbuddy
- [ ] Implement running formatter `prettier --write \"*z*/*.{ts,tsx,mdx,json}\" --cache`
- [ ] Implemetn a full restart of next server `    "re": "rm -rf node_modules && [ -d .next ] && rm -rf .next; pnpm i && (pnpm dev --turbo || pnpm dev || pnpm start)",
- [ ] Implement running `typechecker`

## Small functions
- [ ] Implement a function to generate a secret key `openssl rand -base64 32`, or with parameter to generate a different size. Copy to clipboard with prefix SECRET or have parameter to customize the prefix, or not copy. Also have parameter to directly write to .env file.
- [ ] Implement a wrapper around shadcn. Allow insatlling shadcn. Have a param to list all possible components and be able to select multiple and install. Prior to installing ask for if you want regular or "shared" components.json. If shared is chosen we run the entire installation, and after that's done we do `rm components.json` and place this file in the root of the project: 
```json
{
	"$schema": "https://ui.shadcn.com/schema.json",
	"style": "new-york",
	"rsc": true,
	"tsx": true,
	"tailwind": {
		"config": "tailwind.config.ts",
		"css": "src/app/globals.css",
		"baseColor": "neutral",
		"cssVariables": true,
		"prefix": ""
	},
	"aliases": {
		"components": "src/shared/components",
		"utils": "src/shared/helpers",
		"ui": "src/shared/components/ui",
		"lib": "src/shared/helpers",
		"hooks": "src/shared/hooks"
	},
	"iconLibrary": "lucide"
}
``` 
There should be a third option which asks if u want to customize every path which should 1 by 1 prompt for the paths of : 
- css
- basecolor: options are Neutral Gray Zinc Stone or Slate
- components
- utils
- ui
- lib
- hooks

