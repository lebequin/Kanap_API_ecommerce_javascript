const $displayValue = document.getElementById('orderId')
var currentUrl = window.location.href;
var url = new URL(currentUrl);
var orderId = url.searchParams.get("id")

$displayValue.innerHTML = orderId

