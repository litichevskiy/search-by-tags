
var indexedStorage = (function( EventManager ){
    var __index = {
        add : function ( tag, id, callback ) {
            var indx = JSON.parse(localStorage.getItem('__index')),
                isNew = false;

            if ( !indx.hasOwnProperty(tag) ) {
                indx[tag] = [];
                isNew = true;
            }

            indx[tag].push(id);

            indx[tag] = indx[tag].sort();

            localStorage.setItem('__index', JSON.stringify(indx));

            if ( typeof callback === 'function' ) callback(null, isNew);
        },

        __getNotesForTag : function ( tag ) {
            var indx = JSON.parse(localStorage.getItem('__index'));
            return indx[tag];
        },

        remove : function ( id, callback ) {
            
        },

        list : function () {
            var indx = JSON.parse(localStorage.getItem('__index'));

            return Object.keys(indx).sort();
        },

        __init : function () {
            if ( localStorage.getItem('__index') ) {
                console.log('index exists');
                return;
            }

            localStorage.setItem('__index', JSON.stringify({}));
            console.log('index inited');
        }
    };

    __index.__init();

    var events = new EventManager;

    return {

        create : function ( o, callback ) {
            storage.create(o, function(error){
                if ( error ) throw(error);

                var tagsCount = o.tags.length,
                    tagsChanged = false;

                o.tags.forEach(function(tag){
                    __index.add(tag, o.id, function(error, isNewTag){
                        if ( isNewTag ) tagsChanged = true;
                        if ( --tagsCount === 0 ) {
                            if ( tagsChanged ) events.publish('tagschange');
                            return callback(null);
                        }
                    })
                });
            })
        },

        remove : function ( id, callback ) {
            throw('not implemented yet');
            
        },
    
        findByTags : function ( tags, callback ) {
            var notes = [];

            tags.forEach(function(tag){
                notes.push(__index.__getNotesForTag(tag));
            });

            var notesIds = intersection.apply(null, notes),
                notesObjects = notesIds.map(function(id){
                    return JSON.parse( localStorage.getItem(id) );
                });

            callback(null, notesObjects);
        },

        tagsList : function () {
            return __index.list();
        },

        on : events.subscribe.bind(events)

    };



})( EventManager );