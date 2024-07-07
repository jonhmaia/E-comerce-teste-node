const payBtns = document.querySelectorAll(".btn-buy");

payBtns.forEach((payBtn) => {
  payBtn.addEventListener("click", () => {
    fetch("http://localhost:3000/stripe-checkout", { // Certifique-se de que a URL está correta
      method: "post",
      headers: new Headers({ "Content-type": "application/json" }),
      body: JSON.stringify({
        items: JSON.parse(localStorage.getItem("cartItems")),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          location.href = data.url;
        } else {
          console.error('URL not found in response:', data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch:', err);
      });
  });
});
