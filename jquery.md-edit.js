var MdEditor = function(el){
    // Bind passed element to Object so it's accessible for all Class methods
    this.$el = $(el);

    // Bind Events;
    this.bindEvents();
    this.createButtons();
}

MdEditor.prototype.$buttons = {
    'bold': $('<button>Bold</button>')
}

MdEditor.prototype.createButtons = function(){
    var $nav = $('<div>');
    console.log(this.$buttons);
    for( var i in this.$buttons ){
        $nav.append(this.$buttons[i]);
    }
    $nav.insertBefore(this.$el);
}

MdEditor.prototype.bindEvents = function(){
    var that = this;
    for( var i in this.$buttons ){
        this.$buttons[i].on('click', function(e){
            that.$el.focus();
            e.preventDefault();
            that.toggle(i, '##');
        });
    }
}

MdEditor.prototype.toggle = function(format, mark){
    var that = this;
    var selection = this.getInputSelection(this.$el[0]);
    var stringLength = selection.end - selection.start;
    if(that.$el.is(':focus') && stringLength > 0){
        // Get string
        var string = this.$el[0].value.slice(selection.start, selection.end);

        // Assume preceedingMark as false before we check if markdown preceedes the selected string
        var preceedingMark = false;

        // Set preceedingMark to true if the preceeding text is equal to `mark`
        if(selection.start - mark.length > -1 && this.$el[0].value.slice(selection.start - mark.length, selection.start) === mark)
            preceedingMark = true;

        // If the the text already has this mark undo it
        if(preceedingMark){
            that.$el[0].value = that.$el[0].value.slice(0, selection.start - mark.length ) + string + that.$el[0].value.slice(selection.end);
            selection.start -= mark.length;
            selection.end -= mark.length;
        }else{
            that.$el[0].value = that.$el[0].value.slice(0, selection.start) + mark + string + that.$el[0].value.slice(selection.end);
            selection.start += mark.length;
            selection.end += mark.length;
        }


        that.$el[0].selectionStart = selection.start;
        that.$el[0].selectionEnd = selection.end;

        this.$el.trigger('change');
    }
}

//Taken from http://stackoverflow.com/questions/3964710/replacing-selected-text-in-the-textarea
MdEditor.prototype.getInputSelection = function(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

MdEditor.prototype.replaceSelection = function(el, text){
    var sel = getInputSelection(el), val = el.value;
    el.value = val.slice(0, sel.start) + text + val.slice(sel.end);
}

$.fn.mdEditor = function(args){
    var defaults = {
    }

    $(this).each(function(){
        new MdEditor(this, args);
    });
}

$(function(){
    $('[data-toggle="mdedit"]').mdEditor();
});
