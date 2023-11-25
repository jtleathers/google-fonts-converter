function replaceText() {

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

    // Check if matches is not null (i.e., "family=" was found) and if it has more than 2 font families
    if ( matches !== null && matches.length >= 2 ) {

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
            var textToArray2 = fontFamilyWeights.split(';').map(function(item) {
                return item.split(',').map(function(value) {
                    return parseInt(value, 10);
                });
            });

            // Replace the current weights array with this new array
            fontFamily[1] = textToArray2;

            // Check if the font family has both normal and italic weights
            if ( fontFamily[1][0].length > 1 ) {
                // Normal AND Italic 
                var resultStringForZero2 = filterAndExtractMinMax(fontFamily[1], 0);
                var resultStringForOne2 = filterAndExtractMinMax(fontFamily[1], 1);
                
                var combined3 = 'family=' + fontFamily[0] + '0,' + resultStringForZero2 + ';' + '1,' + resultStringForOne2 + '&';

                newURL += combined3;

            } else {
                // Normal OR Italic 
                var flattenedArray2 = fontFamily[1].map(function(subarray) {
                    return subarray[0];
                });

                // Find the minimum and maximum values
                var minValue = Math.min.apply(null, flattenedArray2);
                var maxValue = Math.max.apply(null, flattenedArray2);

                // Create a new array with only the minimum and maximum values
                var resultArray2 = [minValue, maxValue];

                var resultString2 = resultArray2.join('..');
                
                var combined2 = 'family=' + fontFamily[0] + resultString2 + '&';

                newURL += combined2;

            }

        });

        newURL = newURL + 'display=swap';
        
        var updatedURL2 = url.replace(/family=.*?&display=swap/, newURL);                
        
        // Display the resulting url
        document.getElementById("result").innerHTML = updatedURL2;

        // Display the resulting code
        document.getElementById("result-code").innerHTML = '&lt;link rel="preconnect" href="https://fonts.googleapis.com"&gt;<br>&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin&gt;<br>&lt;link href="' + updatedURL2 + '" rel="stylesheet"&gt;';

    } else if ( matches !== null && matches.length == 1 ) {
        // Check if matches is not null (i.e., "family=" was found) and if it has only 1 font family

        // Find everything between wght@ and &display
        var extractedText = url.match(/wght@([^&]*)\&display/g);
        
        // Remove wght@ and &display
        var modifiedText = extractedText[0].replace(/wght@/, '').replace(/&display/, '');

        // Build an array and convert strings to numbers
        var textToArray = modifiedText.split(';').map(function(item) {
            return item.split(',').map(function(value) {
                return parseInt(value, 10);
            });
        });

        if ( textToArray[0].length > 1 ) {
            // This is if both normal and italic are passed in url
            var resultStringForZero = filterAndExtractMinMax(textToArray, 0);
            var resultStringForOne = filterAndExtractMinMax(textToArray, 1);
            
            var combined = 'wght@0,' + resultStringForZero + ';1,' + resultStringForOne + '&display';
        } else {
            // This is if only normal or italic are passed in url
            var flattenedArray = textToArray.map(function(subarray) {
                return subarray[0];
            });

            // Find the minimum and maximum values
            var minValue = Math.min.apply(null, flattenedArray);
            var maxValue = Math.max.apply(null, flattenedArray);

            // Create a new array with only the minimum and maximum values
            var resultArray = [minValue, maxValue];

            var resultString = resultArray.join('..')
            
            var combined = 'wght@' + resultString + '&display';
        }

        // Search for the specified string in testURL and replace it with combined
        updatedURL = url.replace(/wght@.*?&display/, combined);

        // Display the resulting url
        document.getElementById("result").innerHTML = updatedURL;

        // Display the resulting code
        document.getElementById("result-code").innerHTML = '&lt;link rel="preconnect" href="https://fonts.googleapis.com"&gt;<br>&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin&gt;<br>&lt;link href="' + updatedURL + '" rel="stylesheet"&gt;';
    } else {
        // Display the result
        document.getElementById("result").innerHTML = "This is not a Google Fonts URL.";
    }

}