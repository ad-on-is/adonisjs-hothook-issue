import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment';
import { createCommentValidator } from '#validators/comment';
import db from '@adonisjs/lucid/services/db';
export default class CommentsController {


    async create({ request, response, auth, params }: HttpContext) {
        const data = await createCommentValidator.validate(request.all())
        const comment = await Comment.create({
            comment: data.comment,
            post_id: params.id,
            user_id: auth.user!.id
        })
        return response.json({
            comment,
            message: 'Comment created successfully'
        })
    }

    async index({ response, params }: HttpContext) {
        const comments = await db.from('comments')
        .where('post_id', params.id)
        .innerJoin('users', 'users.id', 'comments.user_id')
        .select('comments.*')
        .select('users.full_name')
        .select('users.avatarUrl')
        .paginate(1 , 20)
        return response.json({
            comments,
            message: 'Comments retrieved successfully'
        })
    }

    async show({ response, params }: HttpContext) {
        const comment = await Comment.query()
        .where('id', params.commentId)
        .where('post_id', params.id)
        .firstOrFail()
        return response.json({
            comment,
            message: 'Comment retrieved successfully'
        })
    }
    async update({ request, response, params }: HttpContext) {
        const data = await createCommentValidator.validate(request.all())
        const comment = await Comment.query().where('id', params.id).update({
            comment: data.comment
        })
        return response.json({
            comment,
            message: 'Comment updated successfully'
        })
    }
    async destroy({ response, params, auth }: HttpContext) {
        const comment = await Comment.query().where('id', params.commentId).where('user_id', auth.user!.id).delete()
        return response.json({
            comment,
            message: 'Comment deleted successfully'
        })
    }

}