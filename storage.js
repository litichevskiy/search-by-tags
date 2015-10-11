

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
        //new Date().toString().split(' ').slice(1,5).join(' '); 
        return (new Date()).getTime();
    };


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

   
})();

