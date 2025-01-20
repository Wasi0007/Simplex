package com.backend.backend.presenter.api;


import com.backend.backend.core.dto.request.RequestBagDTO;
import com.backend.backend.core.dto.request.RequestScanOutBagDTO;
import com.backend.backend.core.impl.BagService;
import com.backend.backend.core.impl.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bag")
@RequiredArgsConstructor
public class BagController {

    private final BagService bagService;

    @PostMapping("/scanIn")
    public ResponseEntity<?> scanIn(@RequestBody RequestBagDTO dto) {
        return ResponseEntity.ok(bagService.scanIn(dto));
    }

    @PostMapping("/scanOut")
    public ResponseEntity<?> scanOut(@RequestBody RequestScanOutBagDTO dto) {
        return ResponseEntity.ok(bagService.scanOut(dto));
    }


    @GetMapping("/scanOut")
    public ResponseEntity<?> getscanOut() {
        return ResponseEntity.ok(bagService.getscanOut());
    }

    @GetMapping("/scanIn")
    public ResponseEntity<?> getscanIn() {
        return ResponseEntity.ok(bagService.getscanIn());
    }

}
