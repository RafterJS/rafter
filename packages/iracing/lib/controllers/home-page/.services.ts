export default {
  homeController: {
    path: `${__dirname}/HomeController`,
    dependencies: ['cameraControlService', 'sessionDao'],
  },
};