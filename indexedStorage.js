
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

        remove : function ( id, tags, callback ) {
            var indx = JSON.parse(localStorage.getItem('__index'));

            for ( var i = 0; i <= indx[tags].length; i++ ) {
                indx[tags].splice( i, 1 );

            };

            delete indx[tags]
            localStorage.removeItem( id );
            localStorage.setItem('__index', JSON.stringify( indx ) );

            if ( typeof callback === 'function' ) callback(null);
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

        remove : function ( tags, id, callback ) { 
            //throw('not implemented yet');
            tags.forEach( function( item ){
                __index.remove( id ,item, callback );
            })
            
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
   

function getDate () {

        return  new Date().toString().split(' ').slice(1,5).join(' '); 
 
}


document.addEventListener( 'DOMContentLoaded', displayTags );
document.querySelector('[data-name="visibleForm"]').addEventListener( 'click', hiddenInput );
document.querySelector('[data-name="hiddenForm"]').addEventListener( 'click', visibleInput );
document.querySelector('[data-tags-cont="listTags"]').addEventListener( 'click', selectionTags );
document.querySelector('button[data-name="search"]').addEventListener( 'click', searchNotis );
document.querySelector('ul[data-tags-cont="listHeader"]').addEventListener( 'click', displayNotisContent );
document.querySelector('[data-name="addNotis"]').addEventListener( 'click', addNotis ); 




function addNotis ( ) {
    
    indexedStorage.create({
        
        id      : '',
        type    : document.querySelector('[data-name="headerForNotis"]').value,
        content : document.querySelector('[placeholder="Текст заметки"]').value,
        tags    : document.querySelector('[data-name="tagsName"]').value.split(','),
        date    : getDate()

    },function(){} )

    document.querySelector('[data-name="headerForNotis"]').value = '';
    document.querySelector('[placeholder="Текст заметки"]').value = '';
    document.querySelector('[data-name="tagsName"]').value = '';
};




function hiddenInput( ) {

    document.querySelector('[data-name="add_Remove_tagName"]').style.visibility = 'visible';
    document.querySelector('[data-tags-cont="contentsTag"]').style.visibility = 'hidden';
}; 

function visibleInput ( ) {

    document.querySelector('[data-name="add_Remove_tagName"]').style.visibility = 'hidden';
    document.querySelector('[data-tags-cont="contentsTag"]').style.visibility = 'visible';  

};


function renderTemplate ( tmp, tmplName, o, target ) { 
   var tmpl = tmp = document.querySelector('[data-template-name="'+tmplName+'"]').innerHTML.split('%%');

    html = tmpl.map(function(e, i, a){
        if ( i%2 === 0 ) return e;
        return o[e];
    }).join('');

    target.innerHTML += html;
};


function displayTags ( ) {
    var ul = document.querySelector('ul[data-tags-cont="listTags"]');
    var tmp = document.querySelector('[data-template-name="tag"]');

    var tags = indexedStorage.tagsList();

       
        tags.forEach(function( item ){
            renderTemplate( tmp, 'tag', { TAG_NAME : item, DATA : item }, ul );
        });
};


function selectionTags ( event ) {

    if ( event.target.dataset.nameTag !== undefined && event.target.dataset.nameChecked === 'false' ){
       
        document.querySelector('[data-name="search"]').value += event.target.dataset.nameTag + ',' ;
        event.target.dataset.nameChecked = 'true';
       
    } else {

        if ( event.target.dataset.nameChecked === 'true' ){
            
            event.target.dataset.nameChecked = 'false';
        }
    };

};


function searchNotis(  ) {
    var tags = document.querySelector('[data-name="search"]').value.split(',').slice(0,length-1);
    var ul = document.querySelector('ul[data-tags-cont="listHeader"]');
    var tmp = document.querySelector('[data-template-name="header"]');
    
    indexedStorage.findByTags( tags, function( x, notesArray ){

        notesArray = notesArray.map( function ( item, i ){
        return notesArray;

        });

        notesArray.forEach( function ( item, i ){
            renderTemplate( tmp ,'header', { DATE : item[i].date , HEADER : item[i].type, ID : item[i].id }, ul );
        });

      
    });

    document.querySelector('[data-name="search"]').value = '';
    
};


function displayNotisContent( event ) {
    var ul = document.querySelector('ul[data-tags-cont="notisBody"]');
    var tmp = document.querySelector('[data-template-name="notisBody"]');
   
    if ( event.target.dataset.idName ) {
        
       var notis = JSON.parse( localStorage.getItem( event.target.dataset.idName) );

        renderTemplate( tmp ,'notisBody', { HEADER : notis.type,  CONTENT_NOTIS : notis.content }, ul );

    };
    
};

 

