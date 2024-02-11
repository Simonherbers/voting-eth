# voting-eth
A voting system using the ethereum blockchain

## Was kann mein Voting?
- Es gibt eine Liste an Filmen die eindeutig identifizierbar sind. ✓
- Diese Liste wird pro Voting Iteration festgelegt. ✓
- Jeder kann für einen bestimmten Film voten. ✓
- Es wird sichergestellt, dass jeder nur ein Mal voten kann. ✓
- (optional) Es gibt einen Zeitpunkt zu dem das Voting automatisch beendet wird
- Man kann die Ergebnisse bzw. den aktuellen Stand erst abrufen nachdem man gevotet hat
- Zur Auswertung werden alle Stimmen aufsummiert und die Filme nach der Anzahl an Stimmen geordnet
- Bei einem Unentschieden wird die höhere Platzierung für alle angegeben
- Es werden absolute Anzahlen und relative Prozentwerte angegeben
- (optional) Der Veranstalter (deployer) soll die festgelegten Filme effizient einschränken können um eine zweite Runde zu starten
- (optional) Ein Abstimmender kann sein Stimmrecht an einen anderen Abstimmenden weitergeben. Dieser kann nun zwei Mal abstimmen.
- (optional) Es kann ein Voting für mehrere Gruppen mit jeweils einem Delegierten gestartet werden. Dazu müssen im Voraus die Delegierten gewählt werden.
- (optional) Damit ein solches Voting korrekt verläuft muss die Identität und Zugehörigkeit zur Gruppe der Abstimmenden verifiziert werden
- (optional) E-Mail Verifikation um Botnets auszuschließen