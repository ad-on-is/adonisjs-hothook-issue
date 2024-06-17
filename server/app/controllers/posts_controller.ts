import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post';
import { createPostValidator } from '#validators/post';
import db from '@adonisjs/lucid/services/db'
export default class PostsController {

    async index({ response }: HttpContext) {
        const posts = await db.from('posts')
            .innerJoin('users', 'users.id', 'posts.user_id')
            .leftJoin('comments', 'comments.post_id', 'posts.id')
            .select('posts.*')
            .select('users.full_name')
            .select('users.avatarUrl')
            .select(db.raw('COUNT(comments.id) as comment_count'))
            .groupBy('posts.id', 'users.full_name', 'users.avatarUrl')
            .paginate(1 , 20)

            ;
        return response.json({
            posts,
            message: 'Posts retrieved successfully'
        })
    }

    async create({ request, response, auth }: HttpContext) {
        const data = await createPostValidator.validate(request.all())
        const post = await Post.create({
            ...data,
            user_id: auth.user!.id
        })
        return response.json({
            post,
            message: 'Post created successfully'
        })
    }

    async show({ params, response }: HttpContext) {
        const post = await db.from('posts')
        .where('posts.id', params.id)
        .innerJoin('users', 'users.id', 'posts.user_id')
        .leftJoin('comments', 'comments.post_id', 'posts.id')
        .select('posts.*')
        .select('users.full_name')
        .select('users.avatarUrl')
        .select(db.raw('COUNT(comments.id) as comment_count'))
        .first();

        return response.json({
            post,
            message: 'Post retrieved successfully'
        })
    }
    async update({ params, request, response }: HttpContext) {
        const post = await Post.findOrFail(params.id)
        const data = await createPostValidator.validate(request.all())
        post.merge(data)
        await post.save()
        return response.json({
            post,
            message: 'Post updated successfully'
        })
    }

    async destroy({ params, response, auth }: HttpContext) {
        const post = await Post.query().where('id', params.id).where('user_id', auth.user!.id).firstOrFail()
        await post.delete()
        return response.json({
            message: 'Post deleted successfully'
        })
    }
}