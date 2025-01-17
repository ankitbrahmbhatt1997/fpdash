# Project FYI Document

## Core Development Rules
1. No code changes without explicit user permission
2. No refactoring unless explicitly requested
3. No style fixes unless explicitly requested
4. No modification to line endings (preserve existing format)
5. No removal of existing comments unless explicitly requested
6. All major flow changes must be discussed before implementation
7. All significant decisions and architectural changes must be documented
8. Each major change requires clear explanation of its impact on the system
9. Changes should be limited to only what's necessary for the requested feature
10. Do not change any methods or anything in the files unless absolutely necessary for requested feature
11. Do not do refactoring of code unless explicitly requested
12. Do not fix style in the existing code unless requested
13. Do not add or remove new lines in the end of the code
14. Do not remove existing comments unless explicitly requested or code is removed completely

## Major Decisions & Architecture
1. Using React Query v5 for data fetching and caching
2. Implementing filters with "Apply" button pattern for explicit user control
3. Using shadcn/ui components for UI elements
4. Current focus on OEM provider filtering implementation

## Communication Notes
1. All changes need explicit approval
2. Issues should be clearly identified before implementing solutions
3. Current focus: Fixing list rendering persistence issue 

## Deployment Notes
1. Required Babel Dependencies:
   - @babel/plugin-proposal-private-property-in-object: Required for proper build process
2. Common Deployment Issues:
   - Babel plugin missing errors can be resolved by installing required dependencies
   - Make sure all babel plugins are in dependencies, not devDependencies for Heroku 