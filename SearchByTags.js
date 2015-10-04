

// var storage = [

// 	{
//     	id : 0,
//    		type : 'text',
//     	content : 'Ан-2 (по кодификации НАТО: Colt — «Жеребёнок», разг. — «Аннушка», «Кукурузник» (получил в наследство',
//     	tags : ['самолёты', 'авиация'],
//     	date : '19827481274'
// 	},
// 	{
//     	id : 1,
//    		type : 'text',
//     	content : 'Прототип И-200, эскизный проект которого был разработан ещё в ОКБ Н. Н. Поликарпова, а технический проект и постройка проводились уже во вновь организованном КБ А. И. Микояна, несмотря на принятие его к серийной постройке, не ',
//     	tags : ['самолёты', 'авиация'],
//     	date : '19827481374'
// 	},
// 	{
//     	id : 2,
//    		type : 'text',
//     	content : 'Тирамису́ (итал. Tiramisù, «взбодри меня» от гл. tira - тяни, mi - меня, su - вверх) — итальянский многослойный десерт, в состав кото',
//     	tags : ['еда', 'десерт', 'сыр'],
//     	date : '19827681374'
// 	}
// ];



 var storage = (function(){

    return {
    
        create : function ( o, callback ) {

            var id = o.id = getUnicId();

            localStorage.setItem(id, JSON.stringify(o));

            if ( typeof callback === 'function' ) callback(null);
        },

        remove : function ( id, callback ) {

            localStorage.removeItem(id);

            if ( typeof callback === 'function' ) callback(null);
        },
    
        findByTags : function ( tags, callback ) {
            
            var result = [],
                keysList = Object.keys(localStorage);

            keysList.forEach(function( key ){
                var notice = JSON.parse( localStorage.getItem(key) );

                if ( bIncludesA(tags, notice.tags ) ) result.push(notice);

            });
            
            if ( typeof callback === 'function' ) callback(null, result);
        }
    };


    function getUnicId () {
        return (new Date()).getTime();
    }

    function bIncludesA ( a, b ) {
        a.sort();
        b.sort();

    var isMatch = false,
        count = 0,
        countA = count,
        countB = count,
        aLength = a.length;

    while( count <= aLength ) { 
        
        if ( a[ countA ] < b[ countB ] ) {
            return isMatch;
        } else {
            if ( a[ countA ] === b[ countB ] ) {

                return isMatch = true;
            } else {
                if ( b[ countB ] < a[ countA ] ) {
                    countB++;
                    continue; 
                }
            }
        } 

    }  

    return isMatch;
};

    // function bIncludesA ( a, b ) {
    //     var isMatch = false;

    //     for ( var i = 0, l = a.length; i < l; i++ ) {
        
    //         var is = false;

    //         for ( var k = 0, l = b.length; k < l; k++ ) {

    //             if ( a[i] === b[k] ) {
    //                 is = true;
    //                 break;
    //             }
    //         }

    //         if ( is ) isMatch = true;
    //         else break;
    //     }

    //     return isMatch;
    // }

})();




var indexedStorage = (function(){
    var __index = {
        add : function ( tag, id, callback ) {
            var indx = JSON.parse(localStorage.getItem('__index'));

            if ( !indx.hasOwnProperty(tag) ) indx[tag] = [];

            indx[tag].push(id);

            indx[tag] = indx[tag].sort();

            localStorage.setItem('__index', JSON.stringify(indx));

            if ( typeof callback === 'function' ) callback(null);
        },

        __getNotesForTag : function ( tag ) {
            var indx = JSON.parse(localStorage.getItem('__index'));
            return indx[tag];
        },

        remove : function ( id, callback ) {
            var indx = JSON.parse(localStorage.getItem('__index'));
            var res = JSON.parse( localStorage.__index )
            var qq = res[id];
            localStorage.removeItem( res[id] ); 
            for( var i = indx[id].length; i >= 0; i-- ) {
                indx[id].splice( i, 1 );
            } 


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

    return {

        create : function ( o, callback ) {
            storage.create(o, function(error){
                if ( error ) throw(error);

                var tagsCount = o.tags.length;

                o.tags.forEach(function(tag){
                    __index.add(tag, o.id, function(error){
                        if ( --tagsCount === 0 ) return callback(null);
                    })
                });
            })
        },

        remove : function ( tags, callback ) {
            //throw('not implemented yet');
            __index.remove( tags );

            localStorage.removeItem( tags )
           
           
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
        }

    };



})();






///////////////////////////////////////////////////

// var storage = (function(){

//     return {
    
//         create : function ( o, callback ) {

//             var id = o.id = getUnicId();

//             localStorage.setItem(id, JSON.stringify(o));

//             if ( typeof callback === 'function' ) callback(null);
//         },

//         remove : function ( id, callback ) {

//             localStorage.removeItem(id);

//             if ( typeof callback === 'function' ) callback(null);
//         },
    
//         findByTags : function ( tags, callback ) {
            
//             var result = [],
//                 keysList = Object.keys(localStorage);

//             keysList.splice( keysList.indexOf('__index'), 1);

//             keysList.forEach(function(key){
//                 var notice = JSON.parse( localStorage.getItem(key) );

//                 if ( bIncludesA(tags, notice.tags) ) result.push(notice);

//             });
            
//             if ( typeof callback === 'function' ) callback(null, result);
//         }
//     };


//     function getUnicId () {
//         return (new Date()).getTime();
//     }

//     function bIncludesA ( a, b, unsorted ) {
    
//         if ( unsorted ) {
//             a = a.sort();
//             b = b.sort();
//         }
    
//         var aPointer = bPointer = 0,
//             aLength = a.length,
//             bLength = b.length,
//             matches = 0;
    
//         while ( aPointer < aLength && bPointer < bLength ) {
    
//             if ( a[aPointer] === b[bPointer] ) {
    
//                 matches++;
//                 aPointer++;
//                 bPointer++;
//                 continue;
    
//              } else if ( a[aPointer] > b[bPointer] ) {
    
//                 bPointer++;
//                 continue;
    
//             }
    
//             break;
//         }
    
//         return aLength === matches;
//     }

// })();

document.querySelector('[data-name="visibleForm"]').onclick = function ( ) {

    document.querySelector('[data-name="add_Remote_tagName"]').style.visibility = 'visible';
    document.querySelector('[data-name="visibleForm"]').style.visibility = 'hidden';
};


document.querySelector('[data-name="hiddenForm"]').onclick = function( ) {

    document.querySelector('[data-name="add_Remote_tagName"]').style.visibility = 'hidden';
    document.querySelector('[data-name="visibleForm"]').style.visibility = 'visible';  
}
