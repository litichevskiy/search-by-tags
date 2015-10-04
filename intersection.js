


function intersection () {

    var arrays   = [].slice.call(arguments),
        pointers = arrays.map(function(){return 0}),
        min      = arrays[0][0],
        result   = [],
        currentMatches = 0;

    MAIN:
    while ( true ) {
        ARRAYS:
        for ( var index = 0; index < arrays.length; index++ ) {

            var array = arrays[index];

            if ( min === array[pointers[index]] ) {
                currentMatches++;
                continue ARRAYS;
            } else if ( min > array[pointers[index]] ) {
                for ( var l = arrays[index].length; pointers[index] < l; pointers[index]++ ) {
                    if ( array[ pointers[index] ] === min ) {
                        currentMatches++;
                        continue ARRAYS;
                    } else if ( array[ pointers[index] ] >   min ) {
                        min = array[ pointers[index] ];
                        currentMatches = 0;
                        continue ARRAYS;
                    }
                }
                if ( pointers[index] >= arrays[index].length ) break MAIN;
            } else {
                min = array[pointers[index]];
                currentMatches = 0;
                break ARRAYS;
            }
        };

        if ( currentMatches === arrays.length ) {
            pointers.forEach(function(e, i, a){ a[i] += 1 });
            result.push(min);

            min = arrays[0][ pointers[0] ];
            for ( var index = 0, l = arrays.length; index < l; index++ ) {

                if ( pointers[index] >= arrays[index].length ) break MAIN;

                if ( arrays[index][ pointers[index] ] < min ) {
                    min = arrays[index][ pointers[index] ];
                }
            }
        }

        currentMatches = 0;
    }

    return result;
}