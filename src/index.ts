export default {name: 'OttLib', org: 'Otter-Co'};

export * from './lib/ottstify';

export * from './lib/logger';
export * from './lib/config';
export * from './lib/dataman';
export * from './lib/utils';

import * as mysql_extra from './extras/mysql_extra';
import * as mongodb_extra from './extras/mongodb_extra';

export let extras = {
    mysql_extra,
    mongodb_extra
};

