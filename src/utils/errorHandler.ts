import { Response } from 'express'

export const errorHandler = (error: unknown, res: Response) => {
	if (error instanceof Error) {
		return res.status(500).json({
			errors: [
				{
					status: '500',
					title: 'Internal Server Error',
					detail: error.message || 'Something went wrong',
				},
			],
		})
	}

	return res.status(500).json({
		errors: [
			{
				status: '500',
				title: 'Internal Server Error',
				detail: 'Unknown error occurred',
			},
		],
	})
}
