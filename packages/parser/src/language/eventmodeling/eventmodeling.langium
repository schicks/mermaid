grammar EventModeling
import "../common/common";

terminal ARROW: '-->' | '<--' | '<->';
terminal EM_TITLE: /\[[\w ]+\]/;
terminal EM_DATA: /\([^)]*\)/;

entry EventModeling:
    NEWLINE*
    "eventmodeling"
    (
        NEWLINE
        | TitleAndAccessibilities
        | Statement
    )*
;

fragment Statement:
    systems+=System
    | entities+=Entity
    | edges+=Edge
;

System:
    'system' id=ID title=EM_TITLE? '{'
    (
        NEWLINE
        | events+=Event
    )*
    '}' EOL
;

Event:
    'event' id=ID data=EM_DATA? EOL
;

Entity:
    Screen | Processor | Command | ReadModel
;

Screen:
    'screen' id=ID title=EM_TITLE? EOL
;

Processor:
    'processor' id=ID title=EM_TITLE? EOL
;

Command:
    'command' id=ID data=EM_DATA? title=EM_TITLE? EOL
;

ReadModel:
    'readmodel' id=ID data=EM_DATA? title=EM_TITLE? EOL
;

Edge:
    source=ID arrow=ARROW target=ID EOL
;
