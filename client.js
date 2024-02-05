document.addEventListener('DOMContentLoaded', () => {
    const genButton = document.getElementById('generate');

    let ready = false;
    setReady(true);

    genButton.addEventListener('click', async () => {

        if(document.getElementById('prompt').value === '') {
            alert('Please enter a prompt');
            setReady(true);
            return;
        }

        if(ready === false) return;
        setReady(false);

        if(document.getElementById('exampleprompt')) {
            document.getElementById('exampleprompt').remove();
        }
        const prompt = document.getElementById('prompt').value;
        const size = document.getElementById('size').value;
        const style = document.getElementById('style').value;
        const rewriteCheck = document.getElementById('togglerewrite').checked;
        let rewrite = '';

        const apiKey = document.getElementById('key').value;
        if(apiKey === '') {
            alert('Please enter an OpenAI API key');
            setReady(true);
            return;
        }

        if(rewriteCheck) {
            console.log('rewrite');
            rewrite = `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${prompt}`;
        }

        let data = {
            model: "dall-e-3",
            prompt: rewriteCheck ? rewrite : prompt,
            n: 1,
            size: size,
            style: style
        };

        try {
            let response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey
                },
                body: JSON.stringify(data)
            });

            let responseData = await response.json();

            // Handle the response data
            console.log(responseData);
            const imgList = document.getElementById('imglist');
            let genDiv = document.createElement('div');
            genDiv.classList.add('gen');
            let img = document.createElement('img');
            img.classList.add('genimg');
            img.src = responseData.data[0].url;
            let toggleDescContainer = document.createElement('div');
            toggleDescContainer.classList.add('toggleDescContainer', 'closed');
            let toggleDesc = document.createElement('span');
            toggleDesc.classList.add('toggleDesc', 'material-symbols-outlined');
            toggleDesc.textContent = 'description';
            let desc = document.createElement('p');
            desc.classList.add('imgdesc');
            desc.textContent = prompt;
            toggleDescContainer.appendChild(desc);
            toggleDesc.addEventListener('click', function() {
                toggleDescContainer.classList.toggle('closed');
            });
            genDiv.appendChild(img);
            genDiv.appendChild(toggleDescContainer);
            genDiv.appendChild(toggleDesc);
            imgList.insertBefore(genDiv, imgList.firstChild);

            setReady(true);
        } catch (error) {
            setReady(true);
            alert(error);
        }
    });

    const promptInput = document.getElementById('prompt');
    const textfield = document.querySelector('.textfield');

    promptInput.addEventListener('input', function() {
        textfield.textContent = this.value;
    });

    function setReady(bool) {
        ready = bool;
        const readyListen = document.querySelectorAll('.readylisten');
        readyListen.forEach((el) => {
            if (ready) {
                el.classList.remove('busy');
            } else {
                el.classList.add('busy');
            }
        });
    }
});