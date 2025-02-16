import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { tournamentService } from '../services/TournamentService';

interface TournamentProps {
  roundNumber: number
  teamFocus?: string
}

const D3TournamentBracket = ({ roundNumber, teamFocus }: TournamentProps) => {
  const svgRef = React.useRef(null);

  useEffect(() => {
    const matches = tournamentService.getMatches(roundNumber)

    // SVG dimensions and spacing
    const width = 1900;
    const height = 330;
    const matchWidth = 160;
    const matchHeight = 70;
    const roundSpacing = 250;
    const verticalSpacing = 100;
    const margin = { top: 50, right: 100, bottom: 50, left: 80 };
    let rightSemifinalX = 0;
    let leftSemifinalX = 0;
    const rightAdjustmentX = 200;
    const scaleFactor = 0.7;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width - 600)
      .attr("height", height)
      .append("g")
      .attr("transform", `scale(${scaleFactor}) translate(${margin.left}, ${margin.top})`);


    // Function to create a match box
    function createMatch(group: any, match: any, x: any, y: any, isRight = false) {
      const g = group.append("g")
        .attr("transform", `translate(${x},${y})`);

      // Match container
      const container = g.append("rect")
        .attr("width", matchWidth)
        .attr("height", matchHeight)
        .attr("rx", 4)
        .attr("fill", "white")
        .attr("stroke", "#ddd");
      if (match.teamA === teamFocus || match.teamB === teamFocus) {
        container.attr("stroke", "#000")
      }

      // Divider line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", matchWidth)
        .attr("y1", matchHeight / 2)
        .attr("y2", matchHeight / 2)
        .attr("stroke", "#ddd");

      // Team names and scores
      const textX = isRight ? matchWidth - 10 : 10;
      const scoreX = isRight ? 10 : matchWidth - 10;
      const anchor = isRight ? "end" : "start";
      const scoreAnchor = isRight ? "start" : "end";

      // Team 1
      const t1 = g.append("text")
        .attr("x", textX)
        .attr("y", matchHeight / 4 + 8)
        .attr("text-anchor", anchor)
        .attr("font-size", "14px")
        .text(match.teamA);
      if (match.teamA === teamFocus) {
        t1.attr("font-weight", "bold");
      }
      g.append("text")
        .attr("x", scoreX)
        .attr("y", matchHeight / 4 + 8)
        .attr("text-anchor", scoreAnchor)
        .attr("font-size", "14px")
        .text(match.goalsA);

      // Team 2
      const t2 = g.append("text")
        .attr("x", textX)
        .attr("y", matchHeight * 3 / 4 + 8)
        .attr("text-anchor", anchor)
        .attr("font-size", "14px")
        .text(match.teamB);
      if (match.teamB === teamFocus) {
        t2.attr("font-weight", "bold");
      }

      g.append("text")
        .attr("x", scoreX)
        .attr("y", matchHeight * 3 / 4 + 8)
        .attr("text-anchor", scoreAnchor)
        .attr("font-size", "14px")
        .text(match.goalsB);

      return g;
    }

    // Function to draw connector lines
    function createConnector(group: any, startX: any, startY: any, endX: any, endY: any, bold?: any) {
      const midX = (startX + endX) / 2;

      const p = group.append("path")
        .attr("d", `M ${startX} ${startY} 
                    H ${midX} 
                    V ${endY} 
                    H ${endX}`)
        .attr("fill", "none")
        .attr("stroke", "#ddd");
      if (bold) {
        p.attr("stroke-width", 6);
      }
    }

    // Draw left bracket
    matches.roundOf16Left.forEach((match, i) => {
      const x = 0;
      const y = i * verticalSpacing;
      createMatch(svg, match, x, y);
    });

    matches.quarterFinalsLeft.forEach((match, i) => {
      const x = roundSpacing;
      const y = i * verticalSpacing * 2 + verticalSpacing / 2;
      createMatch(svg, match, x, y);

      // Draw connectors
      createConnector(
        svg,
        matchWidth,
        i * verticalSpacing * 2 + matchHeight / 2,
        x,
        y + matchHeight / 2,
        match.teamA === teamFocus,
      );
      createConnector(
        svg,
        matchWidth,
        (i * 2 + 1) * verticalSpacing + matchHeight / 2,
        x,
        y + matchHeight / 2,
        match.teamB === teamFocus,
      );
    });

    // Draw right bracket (mirror of left)
    const rightStart = width - margin.left - margin.right - matchWidth - rightAdjustmentX;
    matches.roundOf16Right.forEach((match, i) => {
      const x = rightStart;
      const y = i * verticalSpacing;
      createMatch(svg, match, x, y, true);
    });

    matches.quarterFinalsRight.forEach((match, i) => {
      const x = rightStart - roundSpacing;
      const y = i * verticalSpacing * 2 + verticalSpacing / 2;
      createMatch(svg, match, x, y, true);

      // Draw connectors
      createConnector(
        svg,
        x + matchWidth,
        y + matchHeight / 2,
        rightStart,
        i * verticalSpacing * 2 + matchHeight / 2,
        match.teamA === teamFocus,
      );
      createConnector(
        svg,
        x + matchWidth,
        y + matchHeight / 2,
        rightStart,
        (i * 2 + 1) * verticalSpacing + matchHeight / 2,
        match.teamB === teamFocus,
      );
    });

    // Draw semi-finals
    matches.semiFinalsLeft.forEach((match, _i) => {
      const x = roundSpacing * 2;
      const y = verticalSpacing * 1.5;
      createMatch(svg, match, x, y);
      leftSemifinalX = x + matchWidth;
      // Draw connectors from quarter-finals
      createConnector(
        svg,
        roundSpacing + matchWidth,
        verticalSpacing / 2 + matchHeight / 2,
        x,
        y + matchHeight / 2,
        match.teamA === teamFocus,
      );
      createConnector(
        svg,
        roundSpacing + matchWidth,
        verticalSpacing * 2.5 + matchHeight / 2,
        x,
        y + matchHeight / 2,
        match.teamB === teamFocus,
      );
    });

    matches.semiFinalsRight.forEach((match, _i) => {
      const x = rightStart - roundSpacing * 2;
      const y = verticalSpacing * 1.5;
      createMatch(svg, match, x, y, true);

      // Draw connectors
      createConnector(
        svg,
        x + matchWidth,
        y + matchHeight / 2,
        rightStart - roundSpacing,
        verticalSpacing / 2 + matchHeight / 2,
        match.teamA === teamFocus,
      );
      createConnector(
        svg,
        x + matchWidth,
        y + matchHeight / 2,
        rightStart - roundSpacing,
        verticalSpacing * 2.5 + matchHeight / 2,
        match.teamB === teamFocus,
      );
      rightSemifinalX = x
    });

    // Draw final
    const upFinalY = 120
    const panFinalX = 100
    const finalX = ((width - margin.left - margin.right - matchWidth) / 2) - panFinalX;
    const finalY = (verticalSpacing * 1.5) - upFinalY;
    createMatch(svg, matches.final, finalX, finalY);

    // Draw connectors to final
    function createFinalConnector(group: any, startX: any, startY: any, endX: any, endY: any, bold: boolean) {
      const dAttr = `M ${startX} ${startY} 
                    V ${endY} 
                    H ${endX}`
      const p = group.append("path")
        .attr("d", dAttr)
        .attr("fill", "none")
        .attr("stroke", "#ddd");
      if (bold) {
        p.attr("stroke-width", 6);
      }
    }
    createFinalConnector(
      svg,
      finalX + matchWidth / 2,
      finalY + matchHeight,
      // finalX - matchWidth,
      leftSemifinalX,
      finalY + upFinalY + matchHeight / 2,
      matches.final.teamB === teamFocus,
    );
    createFinalConnector(
      svg,
      finalX + matchWidth / 2,
      finalY + matchHeight,
      // finalX + matchWidth,
      rightSemifinalX,
      finalY + upFinalY + matchHeight / 2,
      matches.final.teamA === teamFocus,
    );
  }, [roundNumber]);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="mx-auto"></svg>
    </div>
  );
};

export default D3TournamentBracket;