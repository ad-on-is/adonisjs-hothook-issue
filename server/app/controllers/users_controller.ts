import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.json({
      users,
      message: 'Users retrieved successfully',
    })
  }

  async create({ request, response }: HttpContext) {
    try {
      const data = request.only(['fullName', 'email', 'password'])
      const payload = await createUserValidator.validate(data)
      const user = await User.create(payload)
      return response.json({
        user,
        message: 'User created successfully',
      })
    } catch (error) {
      return response.json({
        errors: [
          {
            field: 'SQL ERROR',
            message: error.message,
          },
        ],
      })
    }
  }
  async show({ params, response }: HttpContext) {
    const user = await User.find(params.id as number)
    return response.json({
      user,
      message: 'User retrieved successfully',
    })
  }
  async update({ auth, request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    const user = await User.find(auth.user!.id)
    if (!user) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
    user.merge(data)
    await user.save()
    return response.json({
      user,
      message: 'User updated successfully',
    })
  }
  async destroy({ auth, response }: HttpContext) {
    const user = await User.find(auth.user!.id)
    if (!user) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
    await user.delete()
    return response.json({
      message: 'User deleted successfully',
    })
  }

  async githubRedirect({ ally }: HttpContext) {
    // GitHub driver instance
    const gh = await ally.use('github').redirect((request) => {
      request.scopes(['user:email', 'repo:invite'])
      request.param('allow_signup', false)
    })
    return gh
  }
  async githubCallback({ ally, response }: HttpContext) {
    const gh = ally.use('github').stateless()
    const ghUser = await gh.user()

    const user_ = await User.query().where('email', ghUser.email).first()
    if (!user_) {
      const user = await User.create({
        fullName: ghUser.name,
        email: ghUser.email,
        social_auth: 'github',
        social_auth_token: ghUser.token.token ?? '',
        avatarUrl: ghUser.avatarUrl,
      })
      const token = await User.accessTokens.create(user, ['post:create', 'post:read'], {
        name: 'web_api_login',
        expiresIn: '30d',

        // expiresIn : '1 minutes'
      })

      return response.json({
        user,
        type: 'bearer',
        value: token.value!.release(),
        message: 'User logged in successfully',
      })
    }

    const token = await User.accessTokens.create(user_, ['post:create', 'post:read'], {
      name: 'web_api_login',
      expiresIn: '30d',

      // expiresIn : '1 minutes'
    })

    response.json({
      user: user_,
      type: 'bearer',
      value: token.value!.release(),
      message: 'User logged in successfully',
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.query().where('email', email).first()
    if (!user) {
      return response.status(404).json({
        errors: [
          {
            message: 'User not found',
          },
        ],
      })
    }
    await hash.verify(password, user.password)
    const user_ = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user_, ['post:create', 'post:read'], {
      name: 'web_api_login',
      expiresIn: '30d',

      // expiresIn : '1 minutes'
    })

    response.json({
      user: user_,
      type: 'bearer',
      value: token.value!.release(),
      message: 'User logged in successfully',
    })
  }

  async logout({ response, auth }: HttpContext) {
    const user = await User.find(auth!.user!.id)
    if (!user) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
    await User.accessTokens.delete(user, auth.user?.currentAccessToken?.identifier ?? '')
    return response.json({
      message: 'User logged out successfully',
    })
  }
  async getMe({ response, auth }: HttpContext) {
    if (auth.isAuthenticated) {
      const user = await User.find(auth.user!.id)
      return response.json({
        user,
        lastOnline: auth.user?.currentAccessToken.lastUsedAt,
        message: 'User retrieved successfully',
      })
    }
    return response.status(401).json({
      message: 'User not found',
    })
  }
}
