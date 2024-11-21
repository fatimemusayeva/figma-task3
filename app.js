
function activateButtons(sectionId) {
    const section = document.getElementById(sectionId);
    const buttons = section.querySelectorAll("button");
  
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  
 let menu = document.querySelector(".navbar");
 let showMenu = document.querySelector(".show-menu");
 showMenu.addEventListener("click",()=>{
    menu.classList.toggle("show")
 })

  document.addEventListener("DOMContentLoaded", () => {
    const messageElement = document.createElement("p");
    messageElement.id = "error-message"; 
  
    window.addEventListener('online', () => {
      messageElement.remove(); 
    });
  
    window.addEventListener('offline', () => {
      messageElement.textContent = "Нет Интернета"; 
      document.body.appendChild(messageElement);
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll("input");
  

    inputs.forEach((input) => {
        input.addEventListener("input", (event) => {
            let value = input.value;

            value = value.replace(/,/g, ".");

            value = value.replace(/[^0-9.]/g, "");

            const parts = value.split(".");
            if (parts.length > 2) {
                value = parts[0] + "." + parts[1]; 
            }

            if (parts[1] && parts[1].length > 5) {
                value = parts[0] + "." + parts[1].substring(0, 5);
            }

            input.value = value;
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const fromCurrencyButtons = document.querySelectorAll("#fromCurrency button");
    const toCurrencyButtons = document.querySelectorAll("#toCurrency button");

    let fromCurrency = "RUB";
    let toCurrency = "USD";

    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");

    let isInput1Active = true;

    fromCurrencyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            fromCurrencyButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            fromCurrency = button.textContent;
            updateConversionRate();
            if (isInput1Active) {
                convertFromInput1();
            } else {
                convertFromInput2();
            }
        });
    });

    toCurrencyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            toCurrencyButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            toCurrency = button.textContent;
            updateConversionRate();
            if (isInput1Active) {
                convertFromInput1();
            } else {
                convertFromInput2();
            }
        });
    });



    input1.addEventListener("input", () => {
        isInput1Active = true;
        let value = input1.value.trim();
        if (value === "," || value === ".") { 
            input2.value = ""; 
        } else {
            while (value.length > 1 && value[0] === "0" && value[1] !== ".") {
                value = value.slice(1); 
            }
            input1.value = value;
            convertFromInput1();
        }
    });
    
    input2.addEventListener("input", () => {
        isInput1Active = false;
        let value = input2.value.trim();
        if (value === "," || value === ".") { 
            input1.value = ""; 
        } else {
            while (value.length > 1 && value[0] === "0" && value[1] !== ".") {
                value = value.slice(1); 
            }
            input2.value = value;
            convertFromInput2();
        }
    });




    const convertFromInput1 = () => {
        if (fromCurrency === toCurrency) {
            input2.value = input1.value;
            return;
        }
        fetch(`https://v6.exchangerate-api.com/v6/04954366fef251782db8ecb8/latest/${fromCurrency}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.conversion_rates && data.conversion_rates[toCurrency]) {
                    const rate = data.conversion_rates[toCurrency];
                    input2.value = (input1.value * rate).toFixed(5);
                    if (input2.value == 0.00) {
                        input2.value = 0;
                    }
                }
            })
            .catch((error) => console.error("Valyuta çevrilmə xətası:", error));
    };

    const convertFromInput2 = () => {

        if (fromCurrency === toCurrency) {
            input1.value = input2.value;
            return;
        }
        fetch(`https://v6.exchangerate-api.com/v6/04954366fef251782db8ecb8/latest/${toCurrency}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.conversion_rates && data.conversion_rates[fromCurrency]) {
                    const rate = data.conversion_rates[fromCurrency];
                    input1.value = (input2.value * rate).toFixed(5);
                    if (input1.value == 0.00) {
                        input1.value = 0;
                    }
                }
            })
            .catch((error) => console.error("Valyuta çevrilmə xətası:", error));
    };

    const updateConversionRate = () => {

        if (fromCurrency === toCurrency) {
            document.getElementById("p1Value").innerText = `1 ${fromCurrency} = 1.00000 ${toCurrency}`;
            document.getElementById("p2Value").innerText = `1 ${toCurrency} = 1.00000 ${fromCurrency}`;
            return; 
        }
    
        fetch(`https://v6.exchangerate-api.com/v6/04954366fef251782db8ecb8/latest/${fromCurrency}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.conversion_rates) {
                    const rateTo = data.conversion_rates[toCurrency];
                    const rateFrom = 1 / rateTo;

                    document.getElementById("p1Value").innerText = `1 ${fromCurrency} = ${rateTo.toFixed(5)} ${toCurrency}`;
                    document.getElementById("p2Value").innerText = `1 ${toCurrency} = ${rateFrom.toFixed(5)} ${fromCurrency}`;
                }
            })
            .catch((error) => console.error("Valyuta məlumatını yeniləmə xətası:", error));
    };

    const setupCurrencySelectors = () => {
        fromCurrencyButtons.forEach((button) => {
            button.addEventListener("click", () => {
                fromCurrencyButtons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
                fromCurrency = button.textContent;
                updateConversionRate();
            });
        });

        toCurrencyButtons.forEach((button) => {
            button.addEventListener("click", () => {
                toCurrencyButtons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
                toCurrency = button.textContent;
                updateConversionRate();
            });
        });
    };

    const handleInternetReconnect = () => {
        if (isInput1Active) {
            convertFromInput1();
        } else {
            convertFromInput2();
        }
        updateConversionRate();
        console.clear()
    };

    window.addEventListener("online", handleInternetReconnect);

    setupCurrencySelectors();
    updateConversionRate();
});

