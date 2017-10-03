
class LocalCache {

    constructor() {
        this.friends = [] ;
    }

    getAll() {
        return this.friends ;
    }

    populate(friends) {
        this.friends = friends;
    }


}

export default (new LocalCache() );
