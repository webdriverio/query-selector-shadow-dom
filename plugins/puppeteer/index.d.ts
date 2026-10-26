export interface CustomQueryHandler {
    queryOne: (element: Node, selector: string) => Element | null;
    queryAll: (element: Node, selector: string) => Element[];
}

export const QueryHandler: CustomQueryHandler;
