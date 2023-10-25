export function showNotification(data, notificationType) {
    toastr.options = {
        closeButton: false,
        progressBar: true,
        showMethod: "slideDown",
        timeOut: 3000,
        extendedTimeOut: 0,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    if (notificationType === 1) {
        toastr.success(data, "", { iconClass: "toast-success" });
    } else if (notificationType === 0) {
        toastr.error(data, "", { iconClass: "toast-error" });
    }

    // toastr.info("Info Message", "Info Title", { iconClass: "toast-info" });
    // toastr.warning("Warning Message", "Warning Title", { iconClass: "toast-warning" });
}