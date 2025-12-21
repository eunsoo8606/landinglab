const Contact = require('../models/Contact');

/**
 * 문의 제출 처리
 * POST /api/contact
 */
exports.submitContact = async (req, res) => {
  try {
    const {
      projectType,
      services,
      package: packageType,
      reference,
      companyName,
      name,
      phone,
      email,
      website,
      description,
      budget,
      privacyAgree
    } = req.body;

    // 유효성 검사
    if (!name || !email || !phone || !description) {
      return res.status(400).json({
        success: false,
        message: '필수 정보를 모두 입력해주세요.'
      });
    }

    // services 배열을 문자열로 변환 (쉼표 구분)
    const servicesStr = Array.isArray(services) ? services.join(',') : services;

    // Contact 모델을 통해 데이터 저장 (자동 암호화)
    const contactData = {
      name,
      email,
      phone,
      company_name: companyName || null,
      description: description,
      project_type: projectType || null,
      services: servicesStr || null,
      package: packageType || null,
      reference: reference || null,
      website: website || null,
      budget: budget || null,
      privacyAgree: privacyAgree || false
    };

    const result = await Contact.create(contactData);

    res.json({
      success: true,
      message: '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.',
      contactId: result.id
    });

  } catch (error) {
    console.error('문의 제출 오류:', error);
    res.status(500).json({
      success: false,
      message: '문의 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
};

/**
 * 문의 목록 조회 (관리자용)
 * GET /api/contacts
 */
exports.getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const contacts = await Contact.getAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      status
    });

    const total = await Contact.getCount(status);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('문의 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '문의 목록 조회 중 오류가 발생했습니다.'
    });
  }
};

/**
 * 문의 상세 조회 (관리자용)
 * GET /api/contacts/:id
 */
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.getById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '문의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('문의 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '문의 조회 중 오류가 발생했습니다.'
    });
  }
};

/**
 * 문의 상태 업데이트 (관리자용)
 * PUT /api/contacts/:id/status
 */
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 상태값입니다.'
      });
    }

    const result = await Contact.updateStatus(id, status);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: '문의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '상태가 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('문의 상태 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '상태 업데이트 중 오류가 발생했습니다.'
    });
  }
};

/**
 * 문의 삭제 (관리자용)
 * DELETE /api/contacts/:id
 */
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Contact.delete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: '문의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '문의가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('문의 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '문의 삭제 중 오류가 발생했습니다.'
    });
  }
};

module.exports = exports;
