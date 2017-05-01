export default {name: 'OttLib', org: 'Otter-Co'};

export * from './lib/ottstify';

export * from './lib/logger';
export * from './lib/config';
export * from './lib/dataman';
export * from './lib/utils';

import * as dman_extras from './extras/dataman_extra';

export let dataman_extras = dman_extras;

