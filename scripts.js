function convertFontURL() {

    function filterAndExtractMinMax(arr, targetValue) {
        // Filter the arrays where the first value matches the target value
        var filteredArray = arr.filter(function(subarray) {
            return subarray[0] === targetValue;
        });
        
        // Find the minimum and maximum values in the filtered array
        var minValue = Math.min.apply(null, filteredArray.map(function(subarray) {
            return subarray[1];
        }));
        
        var maxValue = Math.max.apply(null, filteredArray.map(function(subarray) {
            return subarray[1];
        }));

        // Create a new array with only the minimum and maximum values
        var resultArray = [minValue, maxValue];

        // Convert the array to a string representation
        return resultArray.join('..');
    }

    // Get the input value
    var url = document.getElementById("urlInput").value;

    // Use a regular expression to find all occurrences of "family="
    var matches = url.match(/family=[^&]*/g);

    // Check if matches is not null (i.e., "family=" was found)
    if ( matches !== null ) {

        // Extract everything from "family=" until the next "&"
        var fontFamiliesArray = matches.map(function(match) {
            var modifiedURL = match.substring(7); // Remove "family="
            var parts = modifiedURL.split('@');
            return [parts[0] + '@', parts.slice(1).join('@')];
        });

        var newURL = '';
        
        // Loop through each font family
        fontFamiliesArray.forEach((fontFamily) => {

            // Grab the weights of the font family
            var fontFamilyWeights = fontFamily[1];

            // Build an array and convert strings to numbers
            var textToArray = fontFamilyWeights.split(';').map(function(item) {
                return item.split(',').map(function(value) {
                    return parseInt(value, 10);
                });
            });

            // Replace the current weights array with this new array
            fontFamily[1] = textToArray;

            // Check if the font family has both normal and italic weights
            if ( fontFamily[1][0].length > 1 ) {
                // Normal AND Italic 
                var resultStringForZero = filterAndExtractMinMax(fontFamily[1], 0);
                var resultStringForOne = filterAndExtractMinMax(fontFamily[1], 1);
                
                var combinedNormalItalic = 'family=' + fontFamily[0] + '0,' + resultStringForZero + ';' + '1,' + resultStringForOne + '&';

                newURL += combinedNormalItalic;

            } else {
                // Normal OR Italic 
                var flattenedArray2 = fontFamily[1].map(function(subarray) {
                    return subarray[0];
                });

                // Find the minimum and maximum values
                var minValue = Math.min.apply(null, flattenedArray2);
                var maxValue = Math.max.apply(null, flattenedArray2);

                // Create a new array with only the minimum and maximum values
                var resultArray = [minValue, maxValue];

                var resultString = resultArray.join('..');
                
                var combinedNormal = 'family=' + fontFamily[0] + resultString + '&';

                newURL += combinedNormal;

            }

        });

        newURL = newURL + 'display=swap';
        
        var updatedURL = url.replace(/family=.*?&display=swap/, newURL);                
        
        // Display the resulting url
        document.getElementById("result").innerHTML = updatedURL;

        // Display the resulting code
        document.getElementById("result-code").innerHTML = '&lt;link rel="preconnect" href="https://fonts.googleapis.com"&gt;<br>&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin&gt;<br>&lt;link href="' + updatedURL + '" rel="stylesheet"&gt;';

    } else {
        // Display the result
        document.getElementById("result").innerHTML = "This is not a Google Fonts URL.";
    }

}