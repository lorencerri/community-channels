import type { PieceContext } from '@sapphire/framework';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';

export class MainRoute extends Route {
	public constructor(context: PieceContext, options?: RouteOptions) {
		super(context, {
			...options,
			route: ''
		});
	}

	public [methods.GET](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'Community Channels!' });
	}

	public [methods.POST](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'Community Channels!' });
	}
}