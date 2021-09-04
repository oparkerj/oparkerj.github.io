updateResult();

for (let input of document.querySelectorAll('input')) {
    let update = function(ev) {
        updateResult();
    };
    input.onchange = ev => update(ev);
    input.oninput = ev => update(ev);
}


function value(id) {
    const e = document.getElementById(id);
    if (e.type === 'checkbox') return e.checked ? 1 : 0;
    return e.value;
}

function builder() {
    return {
        value: '',
        add: function(type) {
            this.value += type + ' ';
            return this;
        },
        addId: function(id) {
            return this.add(value(id));
        }
    };
}

function updateResult() {
    const path = builder()
        .add('M').addId('sx').addId('sy')
        .value;
    const arc = builder()
        .add('A').addId('rx').addId('ry').addId('a').addId('s1').addId('s2').addId('tx').addId('ty')
        .value;
    document.getElementById('move').textContent = path;
    document.getElementById('result').textContent = arc;
    document.getElementById('path').setAttribute('d', path + ' ' + arc);

    const start = document.getElementById('start');
    start.setAttribute('cx', value('sx'));
    start.setAttribute('cy', value('sy'));

    const end = document.getElementById('end');
    end.setAttribute('cx', value('tx'));
    end.setAttribute('cy', value('ty'));
}