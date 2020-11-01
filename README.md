# Name Finder
This app takes a list of first name in txt file and an ebook (.txt) and it outputs the name count in txt file.

## Getting Started

```bash
npm i
npm run build
npm start
```


## Dependencies
```
runtime   - Node.js v14.15.0 (above 12 will be okay)
language  - TypeScript
```

## End Points
Here is a list of end points supported by the app.
```
[GET]  / - shows info
[GET]  /name-count/:name - returns count of the name
[GET]  /generate-output - reads the ebook and outputs the name count in output.txt
[GET]  /status - returns the status of the process (of generating output.txt)
```

## Some Important Improvements
- *[fixed]* `_.words()` may not extract the names exactly as we wanted, for example `john's` would be extracted as `johns`. To get optimal result, a module to clean up such punctuation has to be developed. That would increase the count precision.

- *[fixed]* While streaming chunks, it can pass broken words, which may reduce the count precision. There is a way to stream lines, but that is very slow!

- `threadCount` is set to `3` x `number of cores`. But this requires a lot more experiments to come up with an optimal number
 
## Style Guide
- modules contains helper functions
- middlewares contains middlewares (example: middlewares/users/get-users.ts)
- slug or URL have kebab-case not camelCase
- file / folder are in kebab-case not camelCase

### Author
Md Sadiqur Rahman
