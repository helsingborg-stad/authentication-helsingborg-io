const Joi = require('joi');

const id = Joi.string().regex(/^[0-9]{12}$/).required();
const string = Joi.string().allow('').optional();

module.exports = Joi.object({
    Folkbokforingspost: Joi.object({
        Arendeuppgift: Joi.object({
            andringstidpunkt: string
        }),
        Personpost: Joi.object({
            PersonId: Joi.object({
                PersonNr: id
            }),
            Avregistrering: Joi.object({
                AvregistreringsorsakKod: string,
                Avregistreringsdatum: string
            }),
            Fodelsedatum: string,
            Namn: Joi.object({
                Fornamn: string,
                Mellannamn: string,
                Efternamn: string,
                Aviseringsnamn: string
            }),
            Invandring: Joi.object({
                Invandringsdatum: string
            }),
            Adresser: Joi.object({
                Utlandsadress: Joi.object({
                    Utdelningsadress1: string,
                    Utdelningsadress2: string,
                    Utdelningsadress3: string,
                    Land: string,
                    Utlandsadressdatum: string
                })
            })
        })
    }),
    id: id
});
