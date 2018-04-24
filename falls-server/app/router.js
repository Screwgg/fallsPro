module.exports = app => {
  const { router, controller } = app 
  router.post('/finduser', controller.userController.findUser) 
  router.post('/uniqueuser', controller.userController.uniqueUser) 
  router.post('/createuser', controller.userController.createUser) 
  router.post('/logoutuser', controller.userController.logoutUser) 
  router.post('/updateuser', controller.userController.updateUser) 
  router.get('/getuserinfo', controller.userController.getUserInfo)

  router.post('/createrelease', controller.releaseController.createRelease)
  router.post('/gettoken', controller.releaseController.getToken)
  router.get('/findrelease', controller.releaseController.findRelease)
  router.get('/findallrelease', controller.releaseController.findAllRelease)
  router.get('/getreleasedetail', controller.releaseController.getReleaseDetail)
  router.post('/deleterelease', controller.releaseController.deleteRelease)

  router.post('/createcomment', controller.commentController.createComment)
  router.get('/findcomment', controller.commentController.findComment)
} 
