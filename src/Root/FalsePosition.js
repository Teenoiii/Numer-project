import { useState, useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import { Button, Container, Form, Table, Spinner } from "react-bootstrap";
import { evaluate } from "mathjs";

const FalsePosition = () => {
    const [equation, setEquation] = useState("(x^4) - 13");
    const [XL, setXL] = useState(0);
    const [XR, setXR] = useState(0);
    const [root, setRoot] = useState(null);
    const [data, setData] = useState([]);
    const [html, setHtml] = useState(null);
    const [loading, setLoading] = useState(false); // ✅ เพิ่ม Loading Indicator
    const [history, setHistory] = useState([]); // ✅ เพิ่มตัวแปร History

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
        setHistory(savedHistory);
    }, []);

    const calculateError = (xOld, xNew) => Math.abs((xNew - xOld) / xNew) * 100;

    const calculateFalsePosition = (xl, xr) => {
        let iter = 0;
        const MAX_ITER = 50;
        const epsilon = 0.00001;
        let xm = 0, fXl = 0, fXr = 0, fXm = 0, ea = 100;
        let results = [];

        while (ea > epsilon && iter < MAX_ITER) {
            fXl = evaluate(equation, { x: xl });
            fXr = evaluate(equation, { x: xr });
            xm = xr - (fXr * (xl - xr)) / (fXl - fXr);
            fXm = evaluate(equation, { x: xm });

            iter++;

            if (fXm * fXr > 0) {
                ea = calculateError(xr, xm);
                xr = xm;
            } else if (fXm * fXr < 0) {
                ea = calculateError(xl, xm);
                xl = xm;
            }

            results.push({ iteration: iter, xl: xl, xr: xr, xm: xm, ea: ea });
        }

        setRoot(xm);
        setData(results);
        setHtml(renderTable(results));
        plotGraph(results);

        // ✅ บันทึก History
        const newHistory = [...history, { equation, XL, XR, result: xm }];
        setHistory(newHistory);
        localStorage.setItem("history", JSON.stringify(newHistory));
    };

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            calculateFalsePosition(parseFloat(XL), parseFloat(XR));
            setLoading(false);
        }, 1000);
    };

    const renderTable = (results) => (
        <Container>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>XL</th>
                        <th>XR</th>
                        <th>XM</th>
                        <th>Error (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((row, index) => (
                        <tr key={index}>
                            <td>{row.iteration}</td>
                            <td>{row.xl.toFixed(6)}</td>
                            <td>{row.xr.toFixed(6)}</td>
                            <td>{row.xm.toFixed(6)}</td>
                            <td>{row.ea.toFixed(6)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );

    const plotGraph = (results) => {
        const traceXL = { x: results.map((x) => x.iteration), y: results.map((x) => x.xl), mode: "lines+markers", name: "XL" };
        const traceXM = { x: results.map((x) => x.iteration), y: results.map((x) => x.xm), mode: "lines+markers", name: "XM" };
        const traceXR = { x: results.map((x) => x.iteration), y: results.map((x) => x.xr), mode: "lines+markers", name: "XR" };

        const layout = { title: "False Position Method Iteration", xaxis: { title: "Iteration" }, yaxis: { title: "Value" } };

        Plotly.newPlot("graphDiv", [traceXL, traceXM, traceXR], layout);
    };

    return (
        <Container>
            <h1>False Position Method</h1>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Input Equation (f(x))</Form.Label>
                    <input type="text" value={equation} onChange={(e) => setEquation(e.target.value)} className="form-control" />
                    <Form.Label>Input XL</Form.Label>
                    <input type="number" value={XL} onChange={(e) => setXL(parseFloat(e.target.value))} className="form-control" />
                    <Form.Label>Input XR</Form.Label>
                    <input type="number" value={XR} onChange={(e) => setXR(parseFloat(e.target.value))} className="form-control" />
                </Form.Group>
                <Button variant="dark" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Calculate"}
                </Button>
            </Form>
            <br />
            {root && <h5>Root = {root.toFixed(6)}</h5>}
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

export default FalsePosition;
