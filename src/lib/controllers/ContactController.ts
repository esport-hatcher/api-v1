import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { Contact } from '@models';
import { logRequest } from '@utils';
import { ModelController } from '@controllers';

class ContactController extends ModelController<typeof Contact> {
    constructor() {
        super(Contact);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { name, phoneNumber, email } = req.body;
            let newContact: Contact;
            newContact = await Contact.create({
                name,
                phoneNumber,
                email,
            });
            return res.status(201).json(newContact);
        } catch (err) {
            return next(err);
        }
    }
    @logRequest
    async updateById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { contact } = req;

        try {
            contact.name = req.body.name || contact.name;
            contact.email = req.body.email || contact.email;
            contact.phoneNumber = req.body.phoneNumber || contact.phoneNumber;
            await contact.save();
            return res.status(200);
        } catch (err) {
            return next(err);
        }
    }
}

export const contactController = new ContactController();
