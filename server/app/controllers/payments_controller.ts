import Payment from '#models/payment';
import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http'


export default class PaymentsController {

    async create({ request, response }: HttpContext) {
        try {


            const data = request.all();

            const user = await User.findBy('email', data.email)

            if(!user){
                return response.json({
                    errors : [
                        {
                            message : 'User Not found For This email'
                        }
                    ]
                })
            }

            const userId = user.id;

            const payment = await Payment.create({
                user_id: userId,
                ...data
            })
            return response.json({
                payment
            })

        } catch (error) {
            return response.json({
                errors: error
            })
        }
    }

}