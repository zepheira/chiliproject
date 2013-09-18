DueDateSet = {
    "FUTURE": 1000 * 60 * 60 * 24 * 7 * 3, // 3 weeks in milliseconds
    "beginning": null
};

/**
 * If setting to Under Review
 */
DueDateSet.set = function() {
    var now, duedate;
    now = new Date().valueOf();
    duedate = new Date(now + DueDateSet.FUTURE);
    jQuery("#issue_due_date").val(duedate.toISOString().substr(0, 10));
};

jQuery(document).ready(function() {
    DueDateSet.beginning = jQuery("#issue_status_id").val();
    jQuery("#issue_status_id").bind("change", function(evt) {
        if (DueDateSet.beginning !== "2" && jQuery(this).val() === "2") {
            DueDateSet.set();
        }
    });
});
