// const btn_for_create_route = document.getElementById("createRoute");
// // const btn_for_delete_route = document.getElementById("deleteRoute");
// const btn_for_bus_reach_status = document.getElementById("busReachStatus");

// let base_url = "http://localhost:5000/";

// let routeData = {};
// let deleteRouteIds = {};

// document.addEventListener('DOMContentLoaded', function () {
//     lucide.createIcons();

//     // Event listener for creating a route
//     btn_for_create_route.addEventListener('click', function () {
//         let formDiv = document.createElement("div");
//         formDiv.classList.add("form-div");

//         formDiv.innerHTML = `
//             <form id="route-form">
//                 <label for="source-name">Source Name:</label><br>
//                 <input type="text" id="source-name" name="source-name" required><br><br>
//                 <label for="dest-name">Destination Name:</label><br>
//                 <input type="text" id="dest-name" name="dest-name" required><br><br>
//                 <button type="submit">Submit</button>
//             </form>
//         `;

//         document.getElementById('make').appendChild(formDiv);

//         document.getElementById('route-form').addEventListener('submit', async function (event) {
//             event.preventDefault();
//             const sourceName = document.getElementById('source-name').value;
//             const destName = document.getElementById('dest-name').value;

//             const routeDataObject = {
//                 source: sourceName,
//                 destination: destName
//             };

//             routeData[Object.keys(routeData).length] = routeDataObject;
//             console.log('Route Data:', routeData);

//             try {
//                 const response = await fetch(`${base_url}api/submit`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(routeDataObject)
//                 });

//                 if (response.ok) {
//                     const result = await response.json();
//                     console.log('Response from server:', result);
//                     showMessage(`Route created from ${sourceName} to ${destName}`, 'success');
//                 } else {
//                     console.error('Error submitting route data:', response.statusText);
//                     showMessage('Failed to submit route data.', 'error');
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 showMessage('An error occurred while submitting the data.', 'error');
//             }

//             formDiv.remove();
//         });
//     });

//     // btn_for_delete_route.addEventListener('click', function () {
//     //     let formDiv = document.createElement("div");
//     //     formDiv.classList.add("form-div");

//     //     formDiv.innerHTML = `
//     //         <form id="delete-route-form">
//     //             <label for="route-id">Route ID:</label><br>
//     //             <input type="text" id="route-id" name="route-id" required><br><br>
//     //             <button type="submit">Delete</button>
//     //         </form>
//     //     `;

//     //     document.getElementById('delete').appendChild(formDiv);

//     //     document.getElementById('delete-route-form').addEventListener('submit', function (event) {
//     //         event.preventDefault();
//     //         const routeId = document.getElementById('route-id').value;
//     //         deleteRouteIds[Object.keys(deleteRouteIds).length] = routeId;
//     //         console.log('Route ID to delete:', deleteRouteIds);

//     //         formDiv.remove();
//     //         alert('Route deleted successfully!');
//     //     });
//     // });

//     btn_for_bus_reach_status.addEventListener('click', function () {
//         // Add functionality for marking a bus as reached its destination
//     });
// });

// let endpnt = "api/stops";
// const func = async () => {
//     let link = base_url + endpnt;
//     let res = await fetch(link, {
//         body: routeData,
//         method: 'POST'
//     });
//     var route_data_fetch = await res.json();
// };
const btn_for_create_route = document.getElementById("createRoute");
const btn_for_delete_route = document.getElementById("deleteRouteBtn");  // Ensure this ID matches your HTML
const btn_for_bus_reach_status = document.getElementById("busReachStatus");

let base_url = "http://localhost:5000/";

let routeData = {};
let deleteRouteIds = {};

document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();

    // Event listener for creating a route
    btn_for_create_route.addEventListener('click', function () {
        let formDiv = document.createElement("div");
        formDiv.classList.add("form-div");

        formDiv.innerHTML = `
            <form id="route-form">
                <label for="source-name">Source Name:</label><br>
                <input type="text" id="source-name" name="source-name" required><br><br>
                <label for="dest-name">Destination Name:</label><br>
                <input type="text" id="dest-name" name="dest-name" required><br><br>
                <button type="submit">Submit</button>
            </form>
        `;

        document.getElementById('make').appendChild(formDiv);

        document.getElementById('route-form').addEventListener('submit', async function (event) {
            event.preventDefault();
            const sourceName = document.getElementById('source-name').value;
            const destName = document.getElementById('dest-name').value;

            const routeDataObject = {
                source: sourceName,
                destination: destName
            };

            routeData[Object.keys(routeData).length] = routeDataObject;
            console.log('Route Data:', routeData);

            try {
                const response = await fetch(`${base_url}api/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(routeDataObject)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Response from server:', result);
                    showMessage(`Route created from ${sourceName} to ${destName}`, 'success');
                } else {
                    console.error('Error submitting route data:', response.statusText);
                    showMessage('Failed to submit route data.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('An error occurred while submitting the data.', 'error');
            }

            formDiv.remove();
        });
    });

    // Event listener for deleting a route
    btn_for_delete_route.addEventListener('click', function () {
        let formDiv = document.createElement("div");
        formDiv.classList.add("form-div");

        formDiv.innerHTML = `
            <form id="delete-route-form">
                <label for="route-id">Route ID:</label><br>
                <input type="text" id="route-id" name="route-id" required><br><br>
                <button type="submit">Delete</button>
            </form>
        `;

        document.getElementById('delete').appendChild(formDiv);

        document.getElementById('delete-route-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const routeId = document.getElementById('route-id').value;
            deleteRouteIds[Object.keys(deleteRouteIds).length] = routeId;
            console.log('Route ID to delete:', deleteRouteIds);

            // Perform the delete operation
            fetch(`${base_url}api/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: routeId })
            }).then(response => {
                if (response.ok) {
                    console.log('Route deleted successfully');
                    showMessage('Route deleted successfully!', 'success');
                } else {
                    console.error('Error deleting route:', response.statusText);
                    showMessage('Failed to delete route.', 'error');
                }
            }).catch(error => {
                console.error('Error:', error);
                showMessage('An error occurred while deleting the route.', 'error');
            });

            formDiv.remove();
        });
    });

    btn_for_bus_reach_status.addEventListener('click', function () {
        // Add functionality for marking a bus as reached its destination
    });
});

let endpnt = "api/stops";
const func = async () => {
    let link = base_url + endpnt;
    let res = await fetch(link, {
        body: routeData,
        method: 'POST'
    });
    var route_data_fetch = await res.json();
};
