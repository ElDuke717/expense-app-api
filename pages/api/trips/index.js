import prisma from 'lib/prisma';

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const trips = await prisma.trip.findMany();
        // wait until all calls to the database are done
        await Promise.all(
            trips.map(async trip => {
                trip.expenses = await prisma.expense.findMany({
                    where: {
                        trip: trip.id,
                    },
                });
            })
        )
        return res.status(200).json(trips);
    }

    if (req.method === 'POST') {
        const { user, name, start_date, end_date } = req.body;

        if (!user) {
            return res.status(400)
                .json({ message: 'User is required' })
        }
        if (!name) {
            return res.status(400)
                .json({ message: 'Name is required' })
        }
        await prisma.trip.create({
            data: {
                user,
                name,
                start_date,
                end_date,
            }
        });
        console.log(req.body)
        return res.status(200).end()

    }

    res.status(405).json({
        message: 'Method Not Allowed'
    })

}