// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/',
  imageUrl: 'http://localhost:5000/uploaded/images/',
  videoUrl: 'http://localhost:5000/uploaded/video/',
  imageIconTreatment: 'http://localhost:5000/uploaded/icon/dept7/',
  imageIcon: 'http://localhost:5000/',
  // apiUrl: 'http://10.4.0.78:3030/api/',
  // imageUrl: 'http://10.4.0.78:3030/uploaded/images/',
};
