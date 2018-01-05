$(document).ready(function() {
    var items = new Bloodhound({
        datumTokenizer: function (datum) {
            return Bloodhound.tokenizers.whitespace(datum.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url: "/static/data/subnationals2.json",
            filter: function (data) {
                return $.map(data.response.regions, function (region) {
                    var subnational = region.subnational2_code || region.subnational1_code;

                    return {
                        value: region.name + " (" + subnational + ")"
                        //,code: region.country_code,sub1: region.subnational1_code,sub2: region.subnational2_code
                    };
                });
            }
        }
    });

    // initialize the bloodhound suggestion engine
    items.initialize();

    // set results page to show from url
    page = (document.URL.includes('checklists') ? "checklists" : "notables");

    // instantiate the typeahead UI
    $('#prefetch-find .typeahead').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'engine',
            displayKey: 'value',
            source: items.ttAdapter(),
            templates: {
                empty: [
                "<li class='empty-message'>Unable to find any matching results.</li>"
                ].join('\n'),
                suggestion: function(data) {
                  return "<li><a href='/" + page + "/" + data.value + "'>" + data.value + "</a></li>";
                }
            }
    });
});