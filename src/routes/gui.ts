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

		if (!id.match(/^[0-9a-f]+$/)) return response.json({ message: "Invalid ID" });
		if (index.includes('.')) index = index.split('.')[0];
		if (!index.match(/^[0-9]+$/)) return response.json({ message: "Invalid Index" });

		const stat = statSync(`./files/${id}/${index}.png`);
		if (stat.isFile()) {
			response.writeHead(200, {
				'Content-Type': 'image/png',
				'Content-Length': stat.size,
			})
			const readStream = createReadStream(`./files/${id}/${index}.png`);
			readStream.pipe(response);
		} else return response.json({ message: 'File not found' });
	}
}