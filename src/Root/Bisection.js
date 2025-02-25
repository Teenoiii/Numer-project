import { useState, useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import { Button, Container, Form, Table, Spinner } from "react-bootstrap";
import { evaluate } from "mathjs";

const Sample = () => {
    const [Equation, setEquation] = useState("(x^4)-13");
    const [X, setX] = useState(0);
    const [XL, setXL] = useState(0);
    const [XR, setXR] = useState(0);
    const [html, setHtml] = useState(null);
    const [graph, setGraph] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]); // ✅ เพิ่มตัวแปร History

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
        setHistory(savedHistory);
    }, []);

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const Calbisection = (xl, xr) => {
        let xm, fXm, fXr, ea, scope;
        let iter = 0;
        const MAX = 50;
        const e = 0.00001;
        let data = [];

        do {
            xm = (xl + xr) / 2.0;
            scope = { x: xr };
            fXr = evaluate(Equation, scope);
            scope = { x: xm };
            fXm = evaluate(Equation, scope);

            iter++;
            if (fXm * fXr > 0) {
                ea = error(xr, xm);
                data.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr });
                xr = xm;
            } else if (fXm * fXr < 0) {
                ea = error(xl, xm);
                data.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr });
                xl = xm;
            }
        } while (ea > e && iter < MAX);

        setX(xm);
        setHtml(printTable(data));
        setGraph(plotGraph(data));

        // ✅ บันทึก History
        const newHistory = [...history, { equation: Equation, XL, XR, result: xm }];
        setHistory(newHistory);
        localStorage.setItem("history", JSON.stringify(newHistory));
    };

    const printTable = (data) => (
        <Container>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>XL</th>
                        <th>XM</th>
                        <th>XR</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((element, index) => (
                        <tr key={index}>
                            <td>{element.iteration}</td>
                            <td>{element.Xl}</td>
                            <td>{element.Xm}</td>
                            <td>{element.Xr}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );

    const plotGraph = (data) => {
        const traceXL = { x: data.map((x) => x.iteration), y: data.map((x) => x.Xl), mode: "lines+markers", name: "XL" };
        const traceXM = { x: data.map((x) => x.iteration), y: data.map((x) => x.Xm), mode: "lines+markers", name: "XM" };
        const traceXR = { x: data.map((x) => x.iteration), y: data.map((x) => x.Xr), mode: "lines+markers", name: "XR" };

        const layout = { title: "Bisection Method Iteration", xaxis: { title: "Iteration" }, yaxis: { title: "Value" } };

        Plotly.newPlot("graphDiv", [traceXL, traceXM, traceXR], layout);
    };

    const calculateRoot = () => {
        setLoading(true);
        setTimeout(() => {
            Calbisection(parseFloat(XL), parseFloat(XR));
            setLoading(false);
        }, 1000);
    };

    return (
        <Container>
            <h1>Bisection</h1>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Input f(x)</Form.Label>
                    <input type="text" value={Equation} onChange={(e) => setEquation(e.target.value)} className="form-control" />
                    <Form.Label>Input XL</Form.Label>
                    <input type="number" value={XL} onChange={(e) => setXL(parseFloat(e.target.value))} className="form-control" />
                    <Form.Label>Input XR</Form.Label>
                    <input type="number" value={XR} onChange={(e) => setXR(parseFloat(e.target.value))} className="form-control" />
                </Form.Group>
                <Button variant="dark" onClick={calculateRoot} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Calculate"}
                </Button>
            </Form>
            <br />
            <h5>Answer = {X.toPrecision(7)}</h5>
            {html}
            <Container>
                <div id="graphDiv"></div>
            </Container>

            {/* ✅ แสดงผลย้อนหลัง (ไม่มีปุ่ม "Use Again") */}
            <Container>
                <h2>History</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Equation</th>
                            <th>XL</th>
                            <th>XR</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={index}>
                                <td>{item.equation}</td>
                                <td>{item.XL}</td>
                                <td>{item.XR}</td>
                                <td>{item.result.toFixed(6)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
};

export default Sample;
