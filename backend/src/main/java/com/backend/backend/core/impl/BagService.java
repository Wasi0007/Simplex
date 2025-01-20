package com.backend.backend.core.impl;

import com.backend.backend.common.ApiResponse;
import com.backend.backend.core.dto.request.RequestBagDTO;
import com.backend.backend.core.dto.request.RequestScanOutBagDTO;

public interface BagService {
    ApiResponse<?> scanIn(RequestBagDTO dto);

    ApiResponse<?> scanOut(RequestScanOutBagDTO dto);

    ApiResponse<?> getscanOut();

    ApiResponse<?> getscanIn();
}
