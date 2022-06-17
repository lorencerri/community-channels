import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';
import { createReadStream, statSync } from 'fs';

export class UserRoute extends Route {
	public constructor(context: Route.Context, options: Route.Options) {
		super(context, {
			...options,
			route: 'gui/:id/:index',

		});
	}

	public [methods.GET](request: ApiRequest, response: ApiResponse) {
		const { params } = request;
		let { id, index } = params;

		if (index.includes('.')) index = index.split('.')[0];

		const stat = statSync(`./files/${id}/${index}.png`);
		if (stat.isFile()) {
			response.writeHead(200, {
				'Content-Type': 'image/png',
				'Content-Length': stat.size,
			})
			const readStream = createReadStream(`./files/${id}/${index}.png`);
			readStream.pipe(response);
		} else {
			response.json({ message: 'File not found' });
		}
	}
}