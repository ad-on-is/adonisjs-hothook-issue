/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
const PostsController = () => import('#controllers/posts_controller')
const CommentsController = () => import('#controllers/comments_controller')
const PaymentsController = () => import('#controllers/payments_controller')

import AutoSwagger from '/home/adonis/Development/Node/adonis-autoswagger/dist/index.js'
import swagger from '#config/swagger'
import fs from 'fs/promises'
import { HttpContext } from '@adonisjs/core/http'

router
  .group(() => {
    router
      .group(() => {
        router.get('/me', [UsersController, 'getMe'])
        router.delete('/me', [UsersController, 'destroy'])
        router.put('/me', [UsersController, 'update'])
        router.get('/logout', [UsersController, 'logout'])
        router.post('/logout', [UsersController, 'logout'])

        router.get('/posts', [PostsController, 'index'])
        router.post('/posts', [PostsController, 'create'])
        router.get('/posts/:id', [PostsController, 'show'])
        router.put('/posts/:id', [PostsController, 'update'])
        router.delete('/posts/:id', [PostsController, 'destroy'])

        router.get('/posts/:id/comments', [CommentsController, 'index'])
        router.post('/posts/:id/comments', [CommentsController, 'create'])
        router.get('/posts/:id/comments/:commentId', [CommentsController, 'show'])
        router.put('/posts/:id/comments/:commentId', [CommentsController, 'update'])
        router.delete('/posts/:id/comments/:commentId', [CommentsController, 'destroy'])

        router.get('/payment/config', function ({ response }: HttpContext) {
          return response.json({
            publicKey: process.env.STRIPE_PUBLIC_KEY,
          })
        })

        router.get('/payment/create-payment-intent', [PaymentsController, 'createPaymentIntent'])
        router.post('/payment/payment-save', [PaymentsController, 'retreivePaymentIntent'])
      })
      .middleware(
        middleware.auth({
          guards: ['api'],
        })
      )

    router.post('/login', [UsersController, 'login'])
    router.post('/register', [UsersController, 'create'])

    router.get('/github/redirect', [UsersController, 'githubRedirect'])
    router.get('/github/callback', [UsersController, 'githubCallback'])

    router.post('/payment', [PaymentsController, 'create'])
  })
  .prefix('api/v1')

router.get('/swagger.json', async () => {
  const json = fs.readFile('swagger.json', 'utf8')
  return AutoSwagger.default.writeFile(json, swagger)
})
// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

// default Route

router.get('/', function ({ response }: HttpContext) {
  return response.send(`<h1>Hello Backend is Working on PORT : ${process.env.PORT}</h1>`)
})
