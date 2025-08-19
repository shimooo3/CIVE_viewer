document.addEventListener('DOMContentLoaded', function() {
    const colorInput = document.getElementById('color-input');
    const alphaInput = document.getElementById('alpha');
    const betaInput = document.getElementById('beta');
    const gammaInput = document.getElementById('gamma');
    const deltaInput = document.getElementById('delta');

    const graphs = {
        'graph-3d': {
            dim: 3, 
            layout: { 
                title: 'RGB 3D',
                scene: {
                    xaxis: { title: 'R', range: [0, 255] },
                    yaxis: { title: 'G', range: [0, 255] },
                    zaxis: { title: 'B', range: [0, 255] }
                }
            }
        },
        'graph-rg': { 
            dim: 2, 
            layout: { 
                title: 'RG', 
                xaxis: { title: 'R', range: [0, 255] }, 
                yaxis: { title: 'G', range: [0, 255] }
            }
        },
        'graph-rb': { 
            dim: 2, 
            layout: { 
                title: 'RB', 
                xaxis: { title: 'R', range: [0, 255] }, 
                yaxis: { title: 'B', range: [0, 255] }
            }
        },
        'graph-gb': { 
            dim: 2, 
            layout: { 
                title: 'GB', 
                xaxis: { title: 'G', range: [0, 255] }, 
                yaxis: { title: 'B', range: [0, 255] }
            }
        }
    };

    function initGraphs() {
        for (const [id, config] of Object.entries(graphs)) {
            Plotly.newPlot(id, [], config.layout);
        }
        drawPlane();
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    function addPointToGraphs(r, g, b) {
        const color = `rgb(${r},${g},${b})`;

        // Remove existing points before adding new ones
        for (const id of ['graph-3d', 'graph-rg', 'graph-rb', 'graph-gb']) {
            const graphDiv = document.getElementById(id);
            const tracesToRemove = [];
            for (let i = 0; i < (graphDiv.data || []).length; i++) {
                if (graphDiv.data[i].name === 'selected_point') {
                    tracesToRemove.push(i);
                }
            }
            if (tracesToRemove.length > 0) {
                Plotly.deleteTraces(id, tracesToRemove);
            }
        }

        // Add new points
        Plotly.addTraces('graph-3d', { x: [r], y: [g], z: [b], mode: 'markers', type: 'scatter3d', marker: { color: color, size: 5 }, name: 'selected_point' });
        Plotly.addTraces('graph-rg', { x: [r], y: [g], mode: 'markers', marker: { color: color, size: 8 }, name: 'selected_point' });
        Plotly.addTraces('graph-rb', { x: [r], y: [b], mode: 'markers', marker: { color: color, size: 8 }, name: 'selected_point' });
        Plotly.addTraces('graph-gb', { x: [g], y: [b], mode: 'markers', marker: { color: color, size: 8 }, name: 'selected_point' });
    }

    function drawPlane() {
        const alpha = parseFloat(alphaInput.value);
        const beta = parseFloat(betaInput.value);
        const gamma = parseFloat(gammaInput.value);
        const delta = parseFloat(deltaInput.value);

        const x = [0, 255, 0, 255];
        const y = [0, 0, 255, 255];
        const z = x.map((xv, i) => (-delta - alpha * xv - beta * y[i]) / gamma);

        const plane = {
            x: x, y: y, z: z,
            type: 'mesh3d',
            opacity: 0.5,
            color: 'lightblue',
            name: 'plane'
        };

        const graphDiv = document.getElementById('graph-3d');
        const tracesToRemove = [];
        for (let i = 0; i < (graphDiv.data || []).length; i++) {
            if (graphDiv.data[i].name === 'plane') {
                tracesToRemove.push(i);
            }
        }
        if (tracesToRemove.length > 0) {
            Plotly.deleteTraces('graph-3d', tracesToRemove);
        }
        Plotly.addTraces('graph-3d', plane);
    }

    colorInput.addEventListener('change', (e) => {
        const { r, g, b } = hexToRgb(e.target.value);
        addPointToGraphs(r, g, b);
    });

    [alphaInput, betaInput, gammaInput, deltaInput].forEach(input => {
        input.addEventListener('change', drawPlane);
    });

    initGraphs();
});
